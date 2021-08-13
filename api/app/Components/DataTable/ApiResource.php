<?php

namespace App\Components\DataTable;


class ApiResource implements DataTableInterface
{
    public function setVariable($name, $var)
    {
        $this->vars[$name] = $var;
    }

    public function generateOutput()
    {

    }

}
