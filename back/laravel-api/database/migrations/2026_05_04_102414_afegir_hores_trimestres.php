<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assignatures', function (Blueprint $table) {
            $table->unsignedInteger('hores_1r_trimestre')->nullable();
            $table->unsignedInteger('hores_2n_trimestre')->nullable();
            $table->unsignedInteger('hores_3r_trimestre')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assignatures', function (Blueprint $table) {
            $table->dropColumn('hores_1r_trimestre');
            $table->dropColumn('hores_2n_trimestre');
            $table->dropColumn('hores_3r_trimestre');
        });
    }
};
