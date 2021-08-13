<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model as Eloquent;

abstract class Model extends Eloquent
{

    public $supportedRelations = [];

    public function scopeWithAllRelations($query)
    {
        return $query->with($this->supportedRelations);
    }
}
