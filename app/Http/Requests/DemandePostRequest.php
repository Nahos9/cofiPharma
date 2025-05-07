<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DemandePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name'=>'required|string|max:200',
            'last_name'=>'nullable|string|max:200',
            'email'=>'required|string|max:200',
            'montant'=>'required|string|max:200',
            'phone'=>'nullable|string|max:25'
        ];
    }
}
