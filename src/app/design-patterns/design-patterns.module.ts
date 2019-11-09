import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryMethodComponent } from './factory-method/factory-method.component';
import { AbstractFactoryComponent } from './abstract-factory/abstract-factory.component';
import { DesignPatternsComponent } from './design-patterns.component';
import { BuilderComponent } from './builder/builder.component';
import { SingletonComponent } from './singleton/singleton.component';

@NgModule({
  declarations: [
    DesignPatternsComponent,
    FactoryMethodComponent,
    AbstractFactoryComponent,
    BuilderComponent,
    SingletonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [DesignPatternsComponent]
})
export class DesignPatternsModule { }
