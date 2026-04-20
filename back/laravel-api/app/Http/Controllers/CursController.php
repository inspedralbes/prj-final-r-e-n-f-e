<?php

namespace App\Http\Controllers;

use App\Models\Curs;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CursController extends Controller
{
    /**
     * Display a listing of all courses.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Curs::with(['tutor', 'periode'])->get(),
            'message' => 'Cursos obtinguts correctament'
        ], Response::HTTP_OK);
    }
}
