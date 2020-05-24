import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperatorsPage } from './operators.page';

describe('OperatorsPage', () => {
  let component: OperatorsPage;
  let fixture: ComponentFixture<OperatorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
