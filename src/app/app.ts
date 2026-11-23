import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DemoBanner } from './shared/ui/demo-banner/demo-banner';
import { Footer } from './shared/ui/footer/footer';
import { Header } from './shared/ui/header/header';
import { ToastOutlet } from './shared/ui/toast/toast-outlet';

@Component({
  imports: [RouterOutlet, DemoBanner, Header, Footer, ToastOutlet],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
