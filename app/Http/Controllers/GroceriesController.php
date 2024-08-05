<?php

namespace App\Http\Controllers;

use App\Models\Groceries;
use Illuminate\Http\Request;
use App\Http\Requests\StoreGroceriesRequest;
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
        $groceries = Groceries::query()->orderBy('id', 'desc')->get();

        return response()->json($groceries);
    }

    public function getByID($id)
    {
        $grocery = Groceries::find($id);

        return response()->json($grocery);
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

        return response()->json($grocery);
    }

    /*
    public function importCsv(Request $request)
    {
        try {
            $data = $request->input('csv');
    
            foreach ($data as $row) {
                if (is_array($row) && count($row) >= 4) {
                    Groceries::create([
                        'name' => $row[0],
                        'unit' => $row[1],
                        'category' => $row[2],
                        'supplier' => $row[3],
                    ]);
                }
            }
    
            return response()->json(['message' => 'imported successfully'], 200);
    
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data', 'error' => $e->getMessage()], 500);
        }
    }
        */

    public function importCsv(Request $request)
    {
        try {
            $data = $request->input('csv');

            foreach ($data as $row) {
                if (!is_array($row) || count($row) < 4) {
                    return response()->json(['message' => 'Invalid CSV structure. Each row must have at least 4 elements: name, unit, category, and supplier.'], 400);
                }

                Groceries::create([
                    'name' => $row[0],
                    'unit' => $row[1],
                    'category' => $row[2],
                    'supplier' => $row[3],
                ]);
            }

            return response()->json(['message' => 'Imported successfully'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data', 'error' => $e->getMessage()], 500);
        }
    }

    

    public function show(Groceries $groceries)
    {
        return response()->json($groceries);
    }

    public function deleteByID($id)
    {
        $grocery = Groceries::find($id);
        if ($grocery) {
            $grocery->delete();
            return response()->json(['success' => 'Grocery item deleted successfully.']);
        } else {
            return response()->json(['error' => 'Grocery item not found.'], 404);
        }
    }
    
    public function deleteAll()
    {
        Groceries::query()->delete();
        return response()->json(['success' => 'All groceries deleted successfully.']);
    }


}
