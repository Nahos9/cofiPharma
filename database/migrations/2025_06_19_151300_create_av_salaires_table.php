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
        Schema::create('av_salaires', function (Blueprint $table) {
            $table->id();
            $table->string('numero_compte');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('nom');
            $table->string('prenom');
            $table->string('montant');
            $table->string('status')->default('en attente');
            $table->string('is_deleted')->default(false);
            $table->string('user_validateur_level')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('av_salaires');
    }
};
