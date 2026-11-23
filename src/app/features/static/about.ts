import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import copy from '../../data/sample/copy.json';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import type { IconName } from '../../shared/ui/icon/icons';

/** About us: intro with photos, buy and rent prices, our vision and coming next, CTA band. */
@Component({
  selector: 'app-about',
  imports: [RouterLink, Button, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly text = copy.about;
  protected readonly visionIcons: IconName[] = ['book', 'user', 'clock'];

  constructor() {
    inject(SeoService).set(copy.seo.about);
  }
}
