import { TestBed } from '@angular/core/testing';

import { BimsyncService } from './bimsync.service';
import { HttpClientModule } from '@angular/common/http';

describe('BimsyncService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
 }));

  it('should be created', () => {
    const service: BimsyncService = TestBed.get(BimsyncService);
    expect(service).toBeTruthy();
  });
});
