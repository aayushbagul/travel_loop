from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.services import note_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/trips", tags=["Notes"])

@router.get("/{trip_id}/notes", response_model=List[NoteResponse])
async def get_notes(trip_id: int, current_user: User = Depends(get_current_user)):
    return await note_service.get_notes(trip_id, current_user.id)

@router.post("/{trip_id}/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(trip_id: int, note_data: NoteCreate, current_user: User = Depends(get_current_user)):
    return await note_service.create_note(trip_id, current_user.id, note_data)

@router.get("/{trip_id}/notes/{note_id}", response_model=NoteResponse)
async def get_note(trip_id: int, note_id: int, current_user: User = Depends(get_current_user)):
    return await note_service.get_note(trip_id, note_id, current_user.id)

@router.put("/{trip_id}/notes/{note_id}", response_model=NoteResponse)
async def update_note(trip_id: int, note_id: int, note_data: NoteUpdate, current_user: User = Depends(get_current_user)):
    return await note_service.update_note(trip_id, note_id, current_user.id, note_data)

@router.delete("/{trip_id}/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(trip_id: int, note_id: int, current_user: User = Depends(get_current_user)):
    await note_service.delete_note(trip_id, note_id, current_user.id)
