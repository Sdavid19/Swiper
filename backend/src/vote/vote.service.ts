import { Injectable } from "@nestjs/common";
import { Room } from "./types";

@Injectable()
export class VoteService {
  private rooms: Map<number, Room> = new Map();

  // Új szoba létrehozása
  createRoom(bankId: number): number {
    let roomId: number;
    do {
      roomId = Math.floor(100000 + Math.random() * 900000);
    } while (this.rooms.has(roomId));

    this.rooms.set(roomId, {
      roomId,
      bankId,
      users: [],
      countdown: undefined
    });

    return roomId;
  }

  // Felhasználó hozzáadása
  addUser(roomId: number, userId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (!room.users.find(u => u.id === userId)) {
      room.users.push({ id: userId, ready: false });
    }
  }

  // Felhasználó eltávolítása
  removeUser(roomId: number, userId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.users = room.users.filter(u => u.id !== userId);

    // Ha nincs felhasználó, töröljük a szobát és a countdownot
    if (room.users.length === 0) {
      if (room.countdown) clearTimeout(room.countdown);
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    }
  }

  // Felhasználók lekérése
  getUsers(roomId: number) {
    const room = this.rooms.get(roomId);
    return room ? room.users : [];
  }

  // Ready státusz beállítása
  setUserReady(roomId: number, userId: number, ready: boolean) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const user = room.users.find(u => u.id === userId);
    if (user) user.ready = ready;
  }

  // Ellenőrizzük, hogy mindenki ready-e
  isEveryoneReady(roomId: number): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    return room.users.length > 0 && room.users.every(u => u.ready);
  }

  // Szoba lekérése
  getRoom(roomId: number): Room | undefined {
    return this.rooms.get(roomId);
  }

  // Szoba törlése
  deleteRoom(roomId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.countdown) {
      clearTimeout(room.countdown);
      room.countdown = undefined;
    }

    this.rooms.delete(roomId);
    console.log(`Room ${roomId} deleted`);
  }

  // Countdown beállítása
  setCountdown(roomId: number, countdown: NodeJS.Timeout) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.countdown = countdown;
  }

  // Countdown törlése
  clearCountdown(roomId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.countdown) {
      clearTimeout(room.countdown);
      room.countdown = undefined;
    }
  }
}