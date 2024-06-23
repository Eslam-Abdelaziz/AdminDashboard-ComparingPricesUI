    import { Component, OnInit } from '@angular/core';
    import { MessageService } from 'primeng/api';
    import { UsersService } from 'src/app/services/users.service';
    import { User } from '../../models/User';
    import { Table, TableModule } from 'primeng/table';
    import { DialogModule } from 'primeng/dialog';
    import { FormsModule } from '@angular/forms';
    import { ButtonModule } from 'primeng/button';
    import { DropdownModule } from 'primeng/dropdown';
    import { FileUploadModule } from 'primeng/fileupload';
    import { InputNumberModule } from 'primeng/inputnumber';
    import { InputTextModule } from 'primeng/inputtext';
    import { InputTextareaModule } from 'primeng/inputtextarea';
    import { RadioButtonModule } from 'primeng/radiobutton';
    import { RatingModule } from 'primeng/rating';
    import { RippleModule } from 'primeng/ripple';
    import { ToastModule } from 'primeng/toast';
    import { ToolbarModule } from 'primeng/toolbar';
    import { CrudRoutingModule } from 'src/app/demo/components/pages/crud/crud-routing.module';

    @Component({
    selector: 'app-users',
    standalone: true,
    imports: [ 
        // CrudRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule],
    providers: [MessageService],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
    })
    export class UsersComponent implements OnInit {
    userDialog: boolean = false;
    deleteUserDialog: boolean = false;
    deleteUsersDialog: boolean = false;

    users: User[] = [];
    _user: User = {
        id: '',
        firstName: '',
        lastName: '',
        gender: '',
        country: '',
        dateOfBirth: undefined,
        email: '',
        userName: '',
        phoneCode: '',
        phoneNumber: ''
    };
    selectedUsers: User[] = [];
    submitted: boolean = false;

    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(private userService: UsersService, private messageService: MessageService) {
        this.cols = [
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'email', header: 'Email' },
        { field: 'phoneNumber', header: 'Phone Number' },
        { field: 'country', header: 'Country' },
        { field: 'assignAdmin', header: 'Assign Admin' }
        ];
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getAllUser().subscribe({
        next: (res: User[]) => this.users = res,
        error: err => console.log(err)
        });
    }

    openNew() {
        this.submitted = false;
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

        editUser(user: User) {
            console.log(user.id);
            this.userService.AssignAdmin(user.id).subscribe({
            next: res => {
                //console.log(res);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User assigned as admin', life: 3000 });
                //console.log(this.messageService)
                this.loadUsers();
            },
            error: err => {
                //console.log('error')
                //console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to assign admin', life: 3000 });
            }
            });
        }
    deleteUser(user: User) {
        this.deleteUserDialog = true;
        this._user = { ...user };
    }

    confirmDeleteSelected() {
        this.deleteUsersDialog = false;
        this.users = this.users.filter(val => !this.selectedUsers.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
        this.selectedUsers = [];
    }

    confirmDelete() {
        this.deleteUserDialog = false;
        this.users = this.users.filter(val => val.id !== this._user.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;

        if (this._user.firstName?.trim()) {
        if (this._user.id) {
            this.users[this.findIndexById(this._user.id)] = this._user;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {
            this._user.id = this.createId();
            this.users.push(this._user);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        }

        this.users = [...this.users];
        this.userDialog = false;
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === id) {
            index = i;
            break;
        }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    }
