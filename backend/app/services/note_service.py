from fastapi import HTTPException
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate
from app.services.trip_service import get_trip

async def get_notes(trip_id: int, user: User):
    await get_trip(trip_id, user)
    return await Note.filter(trip_id=trip_id).all()

async def get_note(trip_id: int, note_id: int, user: User):
    await get_trip(trip_id, user)
    note = await Note.get_or_none(id=note_id, trip_id=trip_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

async def create_note(trip_id: int, user: User, note_data: NoteCreate):
    await get_trip(trip_id, user)
    return await Note.create(trip_id=trip_id, **note_data.model_dump())

async def update_note(trip_id: int, note_id: int, user: User, note_data: NoteUpdate):
    note = await get_note(trip_id, note_id, user)
        
    update_data = note_data.model_dump(exclude_unset=True)
    if update_data:
        await note.update_from_dict(update_data).save()
    return note

async def delete_note(trip_id: int, note_id: int, user: User):
    note = await get_note(trip_id, note_id, user)
    await note.delete()
