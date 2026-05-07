<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('justificants', function (Blueprint $table) {
            $table->date('data_inici')->after('id_alum');
            $table->date('data_fi')->after('data_inici');
            $table->dropColumn('id_assistencia_ini');
            $table->dropColumn('id_assistencia_fi');
        });
    }

    public function down()
    {
        Schema::table('justificants', function (Blueprint $table) {
            $table->dropColumn(['data_inici', 'data_fi']);
            $table->unsignedBigInteger('id_assistencia_ini')->nullable()->after('id_alum');
            $table->unsignedBigInteger('id_assistencia_fi')->nullable()->after('id_assistencia_ini');
        });
    }
};
