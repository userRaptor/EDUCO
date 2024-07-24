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

        return Inertia::render('Groceries/Index', [
            'groceries' => $groceries,
        ]);
    }

    public function getByID($id)
    {
        $grocery = Groceries::find($id);

        if ($grocery) {
            return Inertia::render('Groceries/Show', [
                'grocery' => $grocery,
            ]);
        } else {
            return Inertia::render('Errors/NotFound');
        }
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
        return redirect()->route('groceries.store')
            ->with('success', 'Grocery item created successfully.');
    }

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

        return redirect()->back()->with('success_message', 'imported successfully');

    } catch (\Exception $e) {
        return redirect()->back()->with('error_message', 'Error importing data');
    }
}



    public function show(Groceries $groceries)
    {
        return response()->json($groceries);

        /*
        return Inertia::render('Groceries/Show', [
            'grocery' => $groceries
        ]);
        */
    }

    public function deleteByID($id)
    {
        $grocery = Groceries::find($id);
        if ($grocery) {
            $grocery->delete();
            return redirect()->route('groceries.index')
                ->with('success', 'Grocery item deleted successfully.');
        } else {
            return Inertia::render('Errors/NotFound');
        }
    }

    public function deleteAll()
    {
        Groceries::query()->delete();

        return redirect()->route('groceries.index')
            ->with('success', 'All groceries deleted successfully.');
    }
}
