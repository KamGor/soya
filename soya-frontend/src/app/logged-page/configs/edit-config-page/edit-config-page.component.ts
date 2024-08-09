import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../../api-client.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { toast } from 'ngx-sonner';
import { config, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-config-page',
  templateUrl: './edit-config-page.component.html',
  styleUrl: './edit-config-page.component.scss'
})
export class EditConfigPageComponent {
  public addConfigForm!: FormGroup;
  public itemsConfigForm!: FormArray<FormGroup<{ name: FormControl<string | null>, value: FormControl<string | null>, tags: FormControl<{name: string}[] | null> }>>;
  public suggestions: string[] = [];
  public name: string = '';

  constructor(
    private router: Router,
    private apiClient: ApiClientService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.itemsConfigForm = new FormArray([
      this.getConfigFormGroup(),
    ]);

    this.addConfigForm = new FormGroup({
      items: this.itemsConfigForm,
    });

    const { configId } = await firstValueFrom(this.route.params);
    this.name = configId;

    const { configs: [ { id: name, configValues: [ { value } ], tags } ] } = await this.apiClient.get(`/configs/${this.name}`);

    this.itemsConfigForm.get('0')!.get('name')!.setValue(name);
    this.itemsConfigForm.get('0')!.get('value')!.setValue(value);
    this.itemsConfigForm.get('0')!.get('tags')!.setValue(tags);
  }

  public async filterTags(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const params = new URLSearchParams();
    params.append('search', query);
    const { data } = await this.apiClient.get('/tags', params);
    this.suggestions = data;
  }

  private getConfigFormGroup() {
    return new FormGroup({
      name: new FormControl<string | null>('', [Validators.required]),
      value: new FormControl<string | null>('', []),
      tags: new FormControl<{ name: string }[] | null>(null, []),
    });
  }

  public addRow() {
    this.itemsConfigForm.push(this.getConfigFormGroup());
  }
  
  public deleteRow(index: number) {
    this.itemsConfigForm.removeAt(index);
  }

  public async submit() {
    if(this.itemsConfigForm.invalid) return;
    const mapped = this.itemsConfigForm.controls.map((control) => ({
      newName: control.get('name')?.value,
      value: control.get('value')?.value,
      tagIds: control.get('tags')?.value?.map((tag) => tag.name),
    }));

    await this.apiClient.put(`/configs/${this.name}`, {
      configs: mapped,
    });

    toast('Configs have been successfully added.')

    await this.router.navigate(['..'], { relativeTo: this.route });
  }
}
