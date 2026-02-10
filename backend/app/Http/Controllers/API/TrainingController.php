<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Training;
use Illuminate\Http\Request;

class TrainingController extends Controller
{
    public function index()
    {
        return Training::with('coach')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'date' => 'required|date',
            'description' => 'required|string',
        ]);

        $training = Training::create([
            'coach_id' => $request->user()->id,
            'title' => $request->title,
            'date' => $request->date,
            'description' => $request->description,
        ]);

        return response()->json($training, 201);
    }

    public function update(Request $request, Training $training)
    {
        // Add policy check later
        $training->update($request->all());
        return response()->json($training);
    }

    public function destroy(Training $training)
    {
        $training->delete();
        return response()->json(null, 204);
    }

    public function getAttendance(Training $training)
    {
        return $training->attendances()->with('player.user')->get();
    }

    public function storeAttendance(Request $request, Training $training)
    {
        $request->validate([
            'attendances' => 'required|array',
            'attendances.*.player_id' => 'required|exists:players,id',
            'attendances.*.status' => 'required|in:Present,Absent,Excused,Late',
            'attendances.*.remarks' => 'nullable|string'
        ]);

        foreach ($request->attendances as $record) {
            $training->attendances()->updateOrCreate(
                ['player_id' => $record['player_id']],
                [
                    'status' => $record['status'], 
                    'remarks' => $record['remarks'] ?? null
                ]
            );
        }

        return response()->json(['message' => 'Attendance saved successfully']);
    }
}
