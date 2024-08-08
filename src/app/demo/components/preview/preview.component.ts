import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ElabelService } from '../../service/elabel.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnChanges, OnInit {
  @Input() form: FormGroup
  @Input() sub_image = ''
  @Input() preview_image = ''
  show_portion:boolean=false
  @Input() types = []
  @Input() packages = []
  @Input() ingredients = []
  @Input() containers = []
  @Input() materials = []

  constructor(private fb: FormBuilder, private t: TranslateService, private service: ElabelService, private confirmationService: ConfirmationService, private messageService: MessageService, private _location: Location, private route: ActivatedRoute) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.types)
  }
  ngOnInit(): void {
    
  }

  save() {
    this.service.save(this.form.value).subscribe((response) => {
      this.showBottomCenter()
    })
  }

  back() {
    this._location.back();
  }

  showBottomCenter() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Successo', detail: 'Il record è stato aggiornato' });
  }

  get rules(): FormArray {
    return this.form.get('rules') as FormArray;
  }

  get formIngredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }



  getPackages(n:number) {
    if(this.packages.length) {
      const item = this.packages.filter((e)=>e.id==n)
      return item[0].label
    }
    return ''
  }

  getType(n:number) {
    if(this.types.length) {
      const item = this.types.filter((e)=>e.id==n)
      return item[0].label
    }
    return ''
  }

  getContainer(n:number) {
    for(let k in this.containers) {
      for(let c of this.containers[k].items) {
        if(c.id == n) {
          return c
        }
      }
    }
    return ''
  }

  getMaterial(n:number) {
    for(let k in this.materials) {
      for(let c of this.materials[k].items) {
        if(c.id == n) {
          return c
        }
      }
    }
    return ''
  }

  getIngredient(o:any) {
    if(o.length > 0)
      return o[0].label
  }

}
