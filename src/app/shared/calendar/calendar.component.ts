import { Component, HostListener, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  calendarOpen = false;
  yearDropdownOpen = false;

  today = new Date();
  currentDate = new Date();
  @Input() selectedDate: Date | null = null;

  weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  days: CalendarDay[] = [];

  get currentMonth(): number {
    return this.currentDate.getMonth();
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  get currentMonthName(): string {
    return this.monthNames[this.currentMonth];
  }

  get selectedDateText(): string {
    if (!this.selectedDate) return '';
    const day = String(this.selectedDate.getDate()).padStart(2, '0');
    const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
    const year = String(this.selectedDate.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  yearRange: number[] = [];

  ngOnInit(): void {
    this.generateYearRange();
    this.updateCalendar();
  }

  toggleCalendar(event: MouseEvent): void {
    event.stopPropagation();
    this.calendarOpen = !this.calendarOpen;
  }

  toggleYearDropdown(): void {
    this.yearDropdownOpen = !this.yearDropdownOpen;
  }

  generateYearRange(): void {
    const baseYear = this.today.getFullYear();
    this.yearRange = Array.from({ length: 21 }, (_, i) => baseYear - 10 + i);
  }

  changeMonth(offset: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.updateCalendar();
  }

  selectYear(year: number): void {
    this.currentDate.setFullYear(year);
    this.updateCalendar();
    this.yearDropdownOpen = false;
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.updateCalendar();
  }

  clearDate(): void {
    this.selectedDate = null;
    this.calendarOpen = false;
  }

  selectDate(date: Date): void {
    this.selectedDate = new Date(date);
    this.calendarOpen = false;
    this.updateCalendar();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSelected(date: Date): boolean {
    return (
      this.selectedDate !== null &&
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  updateCalendar(): void {
    const year = this.currentYear;
    const month = this.currentMonth;

    const firstDay = new Date(year, month, 1).getDay();
    const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // Días del mes anterior
    for (let i = 0; i < firstDayAdjusted; i++) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - firstDayAdjusted + i + 1),
        otherMonth: true,
      });
    }

    // Días del mes actual
    for (let i = 1; i <= lastDay; i++) {
      days.push({
        date: new Date(year, month, i),
        otherMonth: false,
      });
    }

    // Días del mes siguiente (relleno hasta 42 días)
    while (days.length < 42) {
      const nextDate = new Date(
        year,
        month,
        lastDay + (days.length - firstDayAdjusted - lastDay + 1)
      );
      days.push({ date: nextDate, otherMonth: true });
    }

    this.days = days;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-picker-container')) {
      this.calendarOpen = false;
      this.yearDropdownOpen = false;
    }
  }
}
