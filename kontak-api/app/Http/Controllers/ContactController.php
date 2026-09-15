<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return response()->json(Contact::with('phones')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'alamat' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'phones' => 'required|array',
            'phones.*.jenis' => 'required|in:Rumah,HP,Kantor',
            'phones.*.nomor_telepon' => 'required|string',
        ]);

        $contact = Contact::create([
            'nama' => $validated['nama'],
            'alamat' => $validated['alamat'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
        ]);

        $contact->phones()->createMany($validated['phones']);

        return response()->json([
            'message' => 'Kontak berhasil dibuat',
            'data' => $contact->load('phones'),
        ], 201);
    }

    public function show($id)
    {
        $contact = Contact::with('phones')->find($id);

        if (!$contact) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return response()->json($contact, 200);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Kontak dihapus'], 200);
    }
}