<?php

namespace App\Http\Controllers;

use App\Models\Groceries;
use Illuminate\Http\Request;
use App\Http\Requests\StoreGroceriesRequest;
use App\Http\Resources\GroceriesResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Psy\Readline\Hoa\Console;

class GroceriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //return DB::select('select * from groceries');

        return GroceriesResource::collection(
            Groceries::query()->orderBy('id', 'desc')->get()
        );
    }

    public function getByID($id)
    {
        return new GroceriesResource(Groceries::find($id));
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'unit' => 'required',
            'category' => 'required',
            'supplier' => 'required',
        ]);

        $grocery = Groceries::create($validatedData);

        return new GroceriesResource($grocery);
    }

    public function uploadCsv(Request $request)
    {
        $data = $request->all();

        foreach ($data as $row) {
            if (count($row) >= 4) {
                Groceries::create([
                    'name' => $row[0],
                    'unit' => $row[1],
                    'category' => $row[2],
                    'supplier' => $row[3],
                ]);
            }
        }
        

        return response()->json(null, 204);
    }



    /**
     * Display the specified resource.
     */
    public function show(Groceries $groceries)
    {
        return new GroceriesResource($groceries);
    }

    /*
    public function destroy(Groceries $groceries)
    {
        // Daten werden in die log-Datei von Laravel geschrieben (storage/logs/laravel.log)
        Log::info('Destroy method called with groceries id: '.$groceries->id);

        $groceries->delete();

        Log::info('Groceries with id: '.$groceries->id.' deleted successfully');

        return response()->json(null, 204);
    }
    */

    public function deleteByID($id)
    {
        $grocery = Groceries::find($id);
        $grocery->delete();

        return response()->json(null, 204);
    }

    public function deleteAll()
    {
        Groceries::query()->delete();

        return response()->json(null, 204);
    }
}
