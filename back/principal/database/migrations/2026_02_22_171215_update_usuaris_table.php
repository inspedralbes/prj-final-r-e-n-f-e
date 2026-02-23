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
        Schema::table('usuaris', function (Blueprint $table) {
            $table->dropForeign(['id_curs']);
            $table->dropColumn('id_curs');
            $table->foreignId('id_classe')->nullable()->nullOnDelete()->constrained('classes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuaris', function (Blueprint $table) {
            $table->dropForeign(['id_classe']);
            $table->dropColumn('id_classe');
            $table->foreignId('id_curs')->nullable()->nullOnDelete();
        });
    }
};
