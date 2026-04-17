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
        Schema::table('periodes', function (Blueprint $table) {
            $table->dropColumn('trimestre_1');
            $table->dropColumn('trimestre_2');
            $table->dropColumn('trimestre_3');
            $table->date('trimestre_1_ini')->nullable(); // 1r_Trimestre
            $table->date('trimestre_1_fi')->nullable(); // 1r_Trimestre
            $table->date('trimestre_2_ini')->nullable(); // 2n_Trimestre
            $table->date('trimestre_2_fi')->nullable(); // 2n_Trimestre
            $table->date('trimestre_3_ini')->nullable(); // 3r_Trimestre
            $table->date('trimestre_3_fi')->nullable(); // 3r_Trimestre
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('periodes', function (Blueprint $table) {
            // Remove the new columns
            $table->dropColumn([
                'trimestre_1_ini',
                'trimestre_1_fi',
                'trimestre_2_ini',
                'trimestre_2_fi',
                'trimestre_3_ini',
                'trimestre_3_fi'
            ]);
            // Restore the old columns
            $table->boolean('trimestre_1')->nullable();
            $table->boolean('trimestre_2')->nullable();
            $table->boolean('trimestre_3')->nullable();
        });
    }
};
