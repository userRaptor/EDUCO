<?php

namespace App\Http\Controllers;

use App\Models\Groceries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreGroceriesRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Psy\Readline\Hoa\Console;

class GroceriesController extends Controller
{
    public function getAllGroceries()
    {
        $groceries = Groceries::query()->orderBy('id', 'desc')->get();

        return response()->json($groceries);
    }

    /*
    public function getByID($id)
    {
        $grocery = Groceries::find($id);

        return response()->json($grocery);
    }
    */

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'unit' => 'required',
            'category' => 'required',
            'supplier' => 'required',
        ], [
            'name.required' => 'The name field is required.',
            'unit.required' => 'The unit field is required.',
            'category.required' => 'The category field is required.',
            'supplier.required' => 'The supplier field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $grocery = Groceries::create($validator->validated());

        return response()->json($grocery, 201);
    }

    public function deleteByID($id)
    {
        $grocery = Groceries::find($id);
        if ($grocery) {
            $grocery->delete();
            return response()->json(['success' => 'Grocery item deleted successfully.'], 200);
        } else {
            return response()->json(['error' => 'Grocery item not found.'], 404);
        }
    }

    public function deleteAll()
    {
        Groceries::query()->delete();
        return response()->json(['success' => 'All groceries deleted successfully.']);
    }

    public function importCsv(Request $request)
    {
        try {
            $data = $request->input('csv');

            foreach ($data as $row) {
                // Skip empty rows
                if (empty($row) || !is_array($row) || count(array_filter($row, fn($value) => trim($value) !== '')) === 0) {
                    continue;
                }

                // Initialize empty fields with "null"
                if (array_filter($row, fn($value) => trim($value) === '') !== []) {
                    $row = array_map(fn($value) => trim($value) === '' ? 'null' : $value, $row);
                    //return response()->json(['message' => 'One or more fields are empty.. Each row must have at least 4 elements: name, unit, category, and supplier.'], 400);
                }

                if (is_array($row) && count($row) == 4) {
                    Groceries::create([
                        'name' => $row[0],
                        'unit' => $row[1],
                        'category' => $row[2],
                        'supplier' => $row[3],
                    ]);
                } else {
                    //return response()->json(['message' => 'Each row must have 4 elements: name, unit, category, and supplier.'], 400);
                }
            }

            return response()->json(['message' => 'imported successfully'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data', 'error' => $e->getMessage()], 500);
        }
    }
}
