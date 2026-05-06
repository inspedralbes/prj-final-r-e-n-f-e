<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('justificants', function (Blueprint $table) {
            $table->date('fecha_inici')->after('id_alum');
            $table->date('fecha_fi')->after('fecha_inici');
            $table->dropColumn('id_assistencia_ini');
            $table->dropColumn('id_assistencia_fi');
        });
    }

    public function down()
    {
        Schema::table('justificants', function (Blueprint $table) {
            $table->dropColumn(['fecha_inici', 'fecha_fi']);
            $table->unsignedBigInteger('id_assistencia_ini')->nullable()->after('id_alum');
            $table->unsignedBigInteger('id_assistencia_fi')->nullable()->after('id_assistencia_ini');
        });
    }
};
