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
            $table->boolean('projecte')->default(false)->after('nom');
            $table->string('interval')->nullable()->after('projecte');
            $table->boolean('exempcio')->default(false)->after('interval');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assignatures', function (Blueprint $table) {
            $table->dropColumn('projecte');
            $table->dropColumn('interval');
            $table->dropColumn('exempcio');
        });
    }
};
