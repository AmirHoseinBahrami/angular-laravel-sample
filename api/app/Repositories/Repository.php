<?php namespace App\Repositories;

use App\Components\DataTable\DataTable;
use App\Components\DataTable\DBResource;
use App\Traits\ResponseApi;
use Illuminate\Database\Eloquent\Model;

class Repository implements RepositoryInterface
{
    use ResponseApi;

    // model property on class instances
    protected $model;

    // Constructor to bind model to repo
    public function __construct(Model $model)
    {
        $this->model = $model;

    }

    // data tabel method for generte data table from database
    public function dbResourceDataTable()
    {
        try {
            $dbResource = new DBResource();
            $dbResource->model = $this->model;
            $dataTable = new DataTable($dbResource);
            $data = $dataTable->generate();
            return $this->success("Data table",  $data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    // data tabel method for generte data table from api
    //* not impelement */
    public function apiResourceDataTable()
    {
        //
    }
}
