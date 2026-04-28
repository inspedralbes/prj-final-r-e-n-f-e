<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE assistencies DROP CONSTRAINT IF EXISTS assistencies_estat_check');
            DB::statement("ALTER TABLE assistencies ADD CONSTRAINT assistencies_estat_check CHECK (estat IN ('Assistit', 'Falta', 'Retard', 'Justificada', 'Retart') OR estat IS NULL)");
            return;
        }

        Schema::table('assistencies', function (Blueprint $table) {
            $table->enum('estat', ['Assistit', 'Falta', 'Retard', 'Justificada', 'Retart'])->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE assistencies DROP CONSTRAINT IF EXISTS assistencies_estat_check');
            DB::statement("ALTER TABLE assistencies ADD CONSTRAINT assistencies_estat_check CHECK (estat IN ('Assistit', 'Falta', 'Retard', 'Retart') OR estat IS NULL)");
            return;
        }

        Schema::table('assistencies', function (Blueprint $table) {
            $table->enum('estat', ['Assistit', 'Falta', 'Retard', 'Retart'])->nullable()->change();
        });
    }
};
