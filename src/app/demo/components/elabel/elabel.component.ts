import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ElabelService } from '../../service/elabel.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-elabel',
  templateUrl: './elabel.component.html',
  styleUrls: ['./elabel.component.scss']
})
export class ElabelComponent {
  form: FormGroup
  id = ''
  preview_image = ''
  sub_image = ''
  breadcrumbItems: MenuItem[] = [];
  filteredCountries: any[] = [];
  geographical_indication = 0
  options = []
  uploadedFiles = []
  type = new FormControl()
  sustainabilityImage = new FormControl()
  previewImage = new FormControl()
  ingredient = new FormControl()
  tmp = new FormControl()

  countries = [ ];
  consumption = [ ];
  containers = [ ];
  materials = [ ];
  packages = [ ];
  productType = [ ];
  types = [ ];
  fullIngredientList = [ ];
  ingredientPicked = [ ];
  ingredients = [ ];



  constructor(private fb: FormBuilder, private t: TranslateService, private service: ElabelService, private confirmationService: ConfirmationService, private messageService: MessageService, private _location: Location, private route: ActivatedRoute) {
    this.form = this.fb.group({
      id: [null, Validators.required],
      qr: [null, Validators.required],
      public_id: [null, Validators.required],
      name: [null, Validators.required],
      alcohol_content_percentage: [null, Validators.required],
      net_content: [null, Validators.required],
      product_name: [null, Validators.required],
      sku: [null, Validators.required],
      country: [null, Validators.required],
      vintage_year: [null, Validators.required],
      packages: [null, Validators.required],
      geographical_indication: [null, Validators.required],
      description: [null, Validators.required],
      product_varieties: [null, Validators.required],
      energy_kj: [null, Validators.required],
      energy_kcal: [null, Validators.required],
      fat: [null, Validators.required],
      fat_sat: [null, Validators.required],
      carb: [null, Validators.required],
      carb_sugar: [null, Validators.required],
      protein: [null, Validators.required],
      salt: [null, Validators.required],
      drive: [false, Validators.required],
      pregnant: [false, Validators.required],
      age: [false, Validators.required],
      sustainibility_bio: [null, Validators.required],
      sustainibility_message: [null, Validators.required],
      rules: new FormArray([]),
      ingredients: new FormArray([]),
      type: [null, Validators.required]
    })

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'E-labels' });
    
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');

      this.service.getOptions().subscribe((response) => {
        const data = response.data
        this.consumption = data.consumption.map(e => {e.value = e.id; return e})
        let containers = data.containers.map(e => {e.value = e.id; return e})
        this.geographical_indication = data.countries.map(e => {e.value = e.id; return e})
        let materials = data.materials.map(e => {e.value = e.id; return e})
        this.packages = data.packages.map(e => {e.value = e.id; return e})
        this.productType = data.productType.map(e => {e.value = e.id; return e})
        this.types = data.types.map(e => {e.value = e.id; return e})
        this.fullIngredientList = data.ingredients
        let ingredients = data.ingredients.map(e => {e.value = e.id; return e})

        containers = containers
        .reduce((acc, obj) => {
          const key = obj.group;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }, {});
        for(let c in containers) {
          const key = c;
          const items = containers[c];
          this.containers.push({
            label : c,
            items : items
          })
        }

        materials = materials
        .reduce((acc, obj) => {
          const key = obj.group;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }, {});
        for(let c in materials) {
          const key = c;
          const items = materials[c];
          this.materials.push({
            label : c,
            items : items
          })
        }

        ingredients = ingredients
        .reduce((acc, obj) => {
          const key = obj.group;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }, {});
        for(let c in ingredients) {
          const key = c;
          const items = ingredients[c];
          this.ingredients.push({
            label : c,
            items : items
          })
        }

      })

      if (id) {
        this.id = id
        this.get()
      }
    });
  }

  save() {
    this.service.save(this.form.value).subscribe((response) => {
      this.showBottomCenter()
    })
  }

  back() {
    this._location.back();
  }
  onChangeIngredient($event) {
    const id = $event.value
    const option = this.fullIngredientList.filter((e) => e.id == id)
    this.ingredientPicked.push(option[0])
    this.formIngredients.push(this.fb.group(option))
  }

  searchCountry(event: any) {
      // in a real application, make a request to a remote url with the query and
      // return filtered results, for demo we filter at client side
      const filtered: any[] = [];
      const query = event.query;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.countries.length; i++) {
          const country = this.countries[i];
          if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }

      this.filteredCountries = filtered;
  }

  deleteRecord(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Confermi di voler eliminare il record?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteRecord(this.id).subscribe((response) => {
          this.back()
        })
      },
      reject: () => {
      }
    });
  }

  showBottomCenter() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Successo', detail: 'Il record è stato aggiornato' });
  }

  addRule() {
    const rule = this.fb.group({container : new FormControl(), material : new FormControl()})
    this.rules.push(rule)
  }

  removeRule(i:number) {
    this.rules.removeAt(i);
  }

  get rules(): FormArray {
    return this.form.get('rules') as FormArray;
  }

  get formIngredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  onBasicUpload() {
    this.get()
  }

  get() {
    this.service.get(this.id).subscribe((response) => {
      this.form.patchValue(response.data)

      if(response.data.vintage_year) {
        this.form.get('vintage_year').setValue(new Date(response.data.vintage_year))
      }

      if(response.data.geographical_indication.length) {
        this.form.get('geographical_indication').setValue(parseInt(response.data.geographical_indication[0].geographical_indication_id))
      }
      debugger

      if(response.data.type) {
        this.form.get('type').setValue(parseInt(response.data.type))
      }

      if(response.data.packages.length) {
       this.form.get('packages').setValue(parseInt(response.data.packages[0].package_id))
      }

      if(response.data.sub_image) {
        this.sub_image = response.data.sub_image
      }

      if(response.data.preview_image) {
        this.preview_image = response.data.preview_image
      }


      this.breadcrumbItems.push({ label: this.form.get('public_id').value });
      this.breadcrumbItems = [...this.breadcrumbItems]
    })
  }

}
