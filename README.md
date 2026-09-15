# Aplikasi Kontak — Laravel REST API + React Frontend

Tugas Praktikum Pemrograman Internet (26STIE05X020) — Pertemuan 5
Teknologi Informasi, Universitas Udayana

---

## Deskripsi Aplikasi

Aplikasi manajemen kontak berbasis web dengan arsitektur **decoupled** (backend & frontend terpisah):

- **Backend**: Laravel 13 REST API + SQLite + Laravel Sanctum (Token Auth)
- **Frontend**: React (Vite)
- **Fitur**:
  - Register & Login user dengan Bearer Token
  - CRUD Kontak (Create, Read, Delete)
  - Relasi 1:N — 1 kontak bisa punya banyak nomor telepon (Rumah / HP / Kantor)

---

## Struktur Folder

tugas-kontak-laravel-react/
├── kontak-api/                    # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php       # register() & login()
│   │   │   └── ContactController.php    # index, store, show, destroy
│   │   └── Models/
│   │       ├── Contact.php              # hasMany(ContactPhone)
│   │       ├── ContactPhone.php         # belongsTo(Contact)
│   │       └── User.php
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── xxxx_create_kontak_table.php
│   │   │   └── xxxx_create_kontak_phones_table.php
│   │   └── database.sqlite
│   ├── routes/api.php
│   └── public/api-tester.html
│
├── kontak-frontend/               # Frontend React
│   ├── src/
│   │   ├── api.js                       # Helper fetch + token
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── AuthForm.jsx             # Form Login/Register
│   │       ├── ContactForm.jsx          # Form Tambah Kontak
│   │       └── ContactList.jsx          # List Kontak
│   └── package.json
│
├── postman_collection.json        # Koleksi Postman
├── .gitignore
└── README.md

---

## Prasyarat

- PHP >= 8.2 dengan ekstensi: zip, fileinfo, pdo_sqlite, sqlite3, openssl, curl, mbstring
- Composer
- Node.js + NPM
- (Opsional) Postman untuk testing API

---

## Cara Menjalankan

### 1. Backend (Laravel)

    cd kontak-api

    # Install dependency
    composer install

    # Setup environment
    copy .env.example .env        # Windows
    # cp .env.example .env        # Linux/Mac

    # Generate application key
    php artisan key:generate

    # Buat file database SQLite
    type nul > database\database.sqlite     # Windows
    # touch database/database.sqlite        # Linux/Mac

    # Konfigurasi .env:
    # DB_CONNECTION=sqlite

    # Jalankan migrasi
    php artisan migrate

    # Jalankan server
    php artisan serve

Backend berjalan di: **http://127.0.0.1:8000**

### 2. Frontend (React)

    cd kontak-frontend

    # Install dependency
    npm install

    # Jalankan dev server
    npm run dev

Frontend berjalan di: **http://localhost:5173**

---

## API Endpoints

Base URL: http://127.0.0.1:8000/api

| Method | Endpoint       | Auth | Deskripsi                              |
|--------|----------------|:----:|----------------------------------------|
| POST   | /register      |  No  | Registrasi user baru, return token     |
| POST   | /login         |  No  | Login, return Bearer token             |
| GET    | /kontak        | Yes  | List semua kontak + nomor telepon      |
| POST   | /kontak        | Yes  | Tambah kontak baru + nomor telepon     |
| GET    | /kontak/{id}   | Yes  | Detail kontak                          |
| DELETE | /kontak/{id}   | Yes  | Hapus kontak                           |

**Autentikasi**: Untuk endpoint protected, sertakan header:

    Authorization: Bearer <access_token>

### Contoh Request

**Register:**

    curl -X POST http://127.0.0.1:8000/api/register \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{"name":"Budi","email":"budi@test.com","password":"secret123"}'

**Login:**

    curl -X POST http://127.0.0.1:8000/api/login \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{"email":"budi@test.com","password":"secret123"}'

**Tambah Kontak:**

    curl -X POST http://127.0.0.1:8000/api/kontak \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -H "Authorization: Bearer <TOKEN>" \
      -d '{
        "nama":"Ani",
        "alamat":"Jimbaran",
        "tanggal_lahir":"2001-05-10",
        "phones":[
          {"jenis":"HP","nomor_telepon":"08123456789"},
          {"jenis":"Kantor","nomor_telepon":"0361123456"}
        ]
      }'

---

## Skema Database

### Tabel kontak

| Kolom         | Tipe      | Keterangan     |
|---------------|-----------|----------------|
| id            | bigint    | Primary Key    |
| nama          | string    | Nama kontak    |
| alamat        | string    | Alamat kontak  |
| tanggal_lahir | date      | Tanggal lahir  |
| created_at    | timestamp | Otomatis       |
| updated_at    | timestamp | Otomatis       |

### Tabel kontak_phones (Relasi 1:N)

| Kolom         | Tipe      | Keterangan                    |
|---------------|-----------|-------------------------------|
| id            | bigint    | Primary Key                   |
| kontak_id     | bigint    | Foreign Key -> kontak.id      |
| jenis         | enum      | Rumah, HP, Kantor             |
| nomor_telepon | string    | Nomor telepon                 |
| created_at    | timestamp | Otomatis                      |
| updated_at    | timestamp | Otomatis                      |

**Relasi**:
- 1 Kontak hasMany ContactPhone
- 1 ContactPhone belongsTo 1 Kontak

---

## Fitur Keamanan

- Password Hashing: Bcrypt (via Hash::make())
- Token Auth: Laravel Sanctum (createToken())
- SQL Injection: Dicegah oleh Eloquent ORM (PDO Parameter Binding)
- XSS: Dicegah oleh JSON serializer Laravel
- CORS: Dikonfigurasi untuk allow origin frontend

---

## Testing

### Postman

1. Import file postman_collection.json ke Postman
2. Jalankan Register -> Login (token otomatis tersimpan)
3. Test endpoint lainnya

### api-tester.html

1. Pastikan php artisan serve jalan
2. Buka http://127.0.0.1:8000/api-tester.html
3. Ikuti urutan: Register -> Login -> List/Tambah/Hapus Kontak

---

## Author

**Nama**: [I Gusti Agung Aditya Laksana]
**NIM**: [2505551145]
**Program Studi**: Teknologi Informasi
**Universitas**: Universitas Udayana