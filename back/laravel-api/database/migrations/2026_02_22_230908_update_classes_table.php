<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assignatures', function (Blueprint $table) {
            $table->dropColumn('projecte');
            $table->unsignedBigInteger('id_classe_projecte')->nullable()->after('nom');
            $table->foreign('id_classe_projecte')->references('id')->on('classes')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assignatures', function (Blueprint $table) {
            $table->dropForeign(['id_classe_projecte']);
            $table->dropColumn('id_classe_projecte');
            $table->boolean('projecte')->default(false)->after('nom');
        });
    }
};
