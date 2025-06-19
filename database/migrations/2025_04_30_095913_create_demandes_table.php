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
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('numero_compte');
            $table->string('montant');
            $table->string('mode_paiement');
            $table->string('numero_carte')->nullable();
            $table->string('status')->default('en attente');
            $table->string('user_validateur_level')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->string('user_who_deleted')->nullable();
            $table->string('phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};
