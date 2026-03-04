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
        Schema::table('assistencies', function (Blueprint $table) {
            $table->dropColumn('estat');
        });

        Schema::table('assistencies', function (Blueprint $table) {
            $table->enum('estat', ['Assistit', 'Falta', 'Retard'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assistencies', function (Blueprint $table) {
            $table->dropColumn('estat');
        });

        Schema::table('assistencies', function (Blueprint $table) {
            $table->enum('estat', ['Assistit', 'Falta', 'Retart'])->nullable();
        });
    }
};
