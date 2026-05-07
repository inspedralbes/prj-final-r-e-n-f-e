<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('justificants', function (Blueprint $table) {
            $table->enum('estat', ['Pendent', 'Acceptada', 'Rebutjada'])
                ->default('Pendent')
                ->after('document');
        });

        DB::table('justificants')->update([
            'estat' => DB::raw("CASE WHEN acceptada THEN 'Acceptada' ELSE 'Pendent' END"),
        ]);

        Schema::table('justificants', function (Blueprint $table) {
            $table->dropColumn('acceptada');
        });
    }

    public function down(): void
    {
        Schema::table('justificants', function (Blueprint $table) {
            $table->boolean('acceptada')->default(false)->after('document');
        });

        DB::table('justificants')->update([
            'acceptada' => DB::raw("CASE WHEN estat = 'Acceptada' THEN 1 ELSE 0 END"),
        ]);

        Schema::table('justificants', function (Blueprint $table) {
            $table->dropColumn('estat');
        });
    }
};
