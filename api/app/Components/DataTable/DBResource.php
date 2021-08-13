<?php

namespace App\Components\DataTable;

use App\Traits\BindsDynamically;
use Illuminate\Support\Facades\DB;

class DBResource implements DataTableInterface
{
    public $model;

    public function generateOutput()
    {
        $tableName = $this->model->getQuery()->from;
        $columns = json_encode($this->model->columns);
        $columns = json_decode($columns);
        $data = DB::table($tableName);
        $col = [];
        if($columns)
        {
            // $col[] = 'id';
            foreach($columns as $column)
            {
                $col[] = $column->field;
            }
            $data = $data->get( $col);
        }
        else
        {
            $data = $data->get();
        }

        $dataTbale =
            array(
                'columns' => $columns,
                'data' => $data);
        return $dataTbale;
    }

}
