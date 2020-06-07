export class User {
    name: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
    nationality: string;
    dob: Date;
    educationBackground: string;
    prefferdModeOfContact: string;
    
    csvHeader(): { id: string, title: string }[] {
        return [{
            id: "Name", title: 'Name'
        }, {
            id: "Gender", title: 'Gender'
        }, {
            id: "Phone", title: 'Phone'
        }, {
            id: "Email", title: 'Email'
        }, {
            id: "Address", title: 'Address'
        }, {
            id: "Nationality", title: 'Nationality'
        }, {
            id: "Date_of_birth", title: 'Date_of_birth'
        }, {
            id: "Education_background", title: 'Education_background'
        }, {
            id: "Preferred_mode_of_contact", title: 'Preferred_mode_of_contact'
        }];
    }
    setCsvData(data: User): any {
        return {
            "Name": data.name,
            "Gender": data.gender,
            "Phone": data.phone,
            "Email": data.email,
            "Address": data.address,
            "Nationality": data.nationality,
            "Date_of_birth": data.dob,
            "Education_background": data.educationBackground,
            "Preferred_mode_of_contact": data.prefferdModeOfContact,
        };
    }
};

