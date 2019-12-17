import { TestBed, inject } from '@angular/core/testing';

import { TaskConfigService } from './task-config.service';

describe('SubjectConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskConfigService]
    });
  });

  it('should be created', inject([TaskConfigService], (service: TaskConfigService) => {
    expect(service).toBeTruthy();
  }));
});
