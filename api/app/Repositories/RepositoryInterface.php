<?php
namespace App\Repositories;

interface RepositoryInterface
{
    // data tabel method for generte data table from database
    public function dbResourceDataTable(array $data);
    // data tabel method for generte data table from api
    public function apiResourceDataTable();
}
