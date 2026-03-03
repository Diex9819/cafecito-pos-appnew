import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private router = inject(Router);

  userName: string = '';
  userRole: string = '';
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.userName = user.name || 'Usuario';
        this.userRole = user.role || 'cajero';
        this.isAdmin = user.role === 'admin';
      }
    } catch (e) {
      this.userName = 'Usuario';
      this.userRole = 'cajero';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}