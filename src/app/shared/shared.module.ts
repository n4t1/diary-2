import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from './modules/custom-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from './pipes/translate.pipe';
import { SearchComponent } from './components/search/search.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

const modules = [
  CustomMaterialModule,
  FormsModule,
  ReactiveFormsModule
];

const pipes = [
  TranslatePipe
];

const components = [
  SearchComponent,
  SpinnerComponent
];

@NgModule({
  imports: [
    CommonModule,
    modules
  ],
  declarations: [
    components,
    pipes
  ],
  exports: [
    modules,
    components,
    pipes
  ]
})
export class SharedModule {}
