<?php

namespace App\Http\Controllers;

use App\Models\Usuari;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CartaFaltesController extends Controller
{
    private string $nodeApiUrl;

    public function __construct()
    {
        $this->nodeApiUrl = env('NODE_PRINCIPAL_API_URL');
    }

    public function generar(Request $peticio)
    {
        // Dades per la generació de la carta
        $validated = $peticio->validate([
            'id_alumne' => 'required|exists:usuaris,id',
            'faltes' => 'required|integer|in:30,60,90',
        ]);

        $alumne = Usuari::findOrFail($validated['id_alumne']);
        
        // Resoldre el tutor automàticament
        $classe = Classe::find($alumne->id_classe);
        
        if (!$classe || !$classe->id_tutor) {
            return response()->json([
                'success' => false,
                'message' => 'L\'alumne no té una classe o un tutor assignat',
            ], Response::HTTP_BAD_REQUEST);
        }

        $tutor = Usuari::findOrFail($classe->id_tutor);
        $CursCicleGrup = $classe->nom;
        $pathJsonFile = base_path('templates-word/info-words.json');
        $jsonFile = json_decode(file_get_contents($pathJsonFile), true);
        $NomCognomDireccio = $jsonFile['NomCognomDireccio'] ?? 'Nom Cognom Direcció';

        error_log('Nom Direcció: ' . $NomCognomDireccio);

        $faltes = $validated['faltes'];

        if (!$alumne->data_naixement) {
            return response()->json([
                'success' => false,
                'message' => 'L\'alumne no té data de naixement definida',
            ], Response::HTTP_BAD_REQUEST);
        }

        $edat = Carbon::parse($alumne->data_naixement)->age;
        $esMajor = $edat >= 18;

        $templatePath = base_path('templates-word/');

        // Comprovem si l'alumne és major d'edat
        if ($esMajor) {
            if ($faltes >= 90) {
                $templateFile = $templatePath . '(Plantilla impersonal) Carta 90 faltes (majors d_edat).docx';
            } else {
                $templateFile = $templatePath . '(Plantilla impersonal) Carta 30_60 faltes (majors d_edat).docx';
            }
        } else {
            if ($faltes >= 90) {
                $templateFile = $templatePath . '(Plantilla impersonal) Carta 90 faltes (menors d_edat).docx';
            } else {
                $templateFile = $templatePath . '(Plantilla impersonal) Carta 30_60 faltes (menors d_edat).docx';
            }
        }

        if (!file_exists($templateFile)) {
            return response()->json([
                'success' => false,
                'message' => 'Plantilla no trobada: ' . $templateFile,
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            Carbon::setLocale('ca');
            $dataAvui = Carbon::now()->translatedFormat('d \d\e F \d\e Y');
            $nomAlumne = $alumne->nom;
            $nomTutor = $tutor->nom;

            error_log('Dades per la carta:' . ' Alumne: ' . $nomAlumne . ', Tutor: ' . $nomTutor . ', Faltes: ' . $faltes . ', Data: ' . $dataAvui . ', CursCicleGrup: ' . $CursCicleGrup . ', NomCognomDireccio: ' . $NomCognomDireccio);

            $processor = new TemplateProcessor($templateFile);
            error_log('Carregada plantilla: ' . $templateFile);
            $processor->setValue('CognomsNomAlumne', $nomAlumne);
            $processor->setValue('#Hores', (string) $faltes);
            $processor->setValue('Data', $dataAvui);
            $processor->setValue('Tutor', $nomTutor);
            $processor->setValue('CursCicleGrup', $CursCicleGrup);
            $processor->setValue('NomCognomDireccio', $NomCognomDireccio);
            $processor->setValue('Dia', Carbon::now()->translatedFormat('j'));
            $processor->setValue('Mes', Carbon::now()->translatedFormat('F'));
            $processor->setValue('Any', Carbon::now()->translatedFormat('Y'));

            $fileName = 'carta_faltes_' . $alumne->id . '_' . time() . '.docx';
            $tempPath = storage_path('app/temp/' . $fileName);

            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            $processor->saveAs($tempPath);

            $wordFileContent = file_get_contents($tempPath);
            $wordBase64 = base64_encode($wordFileContent);

            error_log('Enviant fitxer a Node API per conversió a PDF: ' . $fileName);
            $response = Http::timeout(60)->post($this->nodeApiUrl . '/api/convert/word-to-pdf', [
                'fileBase64' => $wordBase64,
                'fileName' => $fileName,
            ]);

            if ($response->successful()) {
                error_log('Conversió a PDF exitosa per: ' . $fileName);
                unlink($tempPath);
                $pdfFileName = str_replace('.docx', '.pdf', $fileName);
                return response($response->body(), 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename=' . $pdfFileName,
                ]);
            } else {
                Log::error('Node API error: ' . $response->body());
                return response()->download($tempPath, $fileName)->deleteFileAfterSend(true);
            }

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    }
