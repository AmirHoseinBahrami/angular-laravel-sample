<?php

namespace App\Components\DataTable;

use App\Traits\BindsDynamically;
use Illuminate\Support\Facades\DB;

class DBResource implements DataTableInterface
{
    public $model;

    public function generateOutput(array $data)
    {
        $tableName = $this->model->getQuery()->from;
        $columns = json_encode($this->model->columns);
        $columns = json_decode($columns);
        $count = 0;
        $response = DB::table($tableName);
        $col = [];
        if($columns)
        {
            foreach($columns as $column)
            {
                $col[] = $column->field;
            }
            if (isset($data['sort'])) {
                $sorts = json_decode($data['sort']);
                foreach ($sorts as $sort) {
                        $sortField = $sort->sortField;
                        $response = $response->orderBy($sortField, $sort->sortType ?? 'ASC');
                }
            }
            if (isset($data['filter'])) {
                $filters = json_decode($data['filter']);
                foreach ($filters as $index=>$filter) {
                    if($index == 0)
                        $response = $response->where($filter->filterField, $filter->filterOperand, '%'.$filter->filterValue.'%');
                    else
                        $response = $response->orWhere($filter->filterField, $filter->filterOperand,'%'.$filter->filterValue.'%');
                }
            }


            if (isset($data['page'])) {
                $count = $response->count();
                $response = $response->paginate(isset($data['pageSize']) ? $data['pageSize'] : 5);
            } else {
                $count = $response->count();
                $response = $response->get( $col);
            }

        }
        else
        {
            $count = $response->count();
            $response = $response->get();
        }

        $dataTbale =
            array(
                'columns' => $columns,
                'count' => $count,
                'data' => $response);
        return $dataTbale;
    }

}
