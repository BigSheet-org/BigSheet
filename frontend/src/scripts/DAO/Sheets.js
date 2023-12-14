class Sheets {

    static getOwnedSheets() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        title: "Sheet 1",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°1",
                        owner: "Test"
                    },
                    {
                        title: "Sheet 2",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°2",
                        owner: "Test3"
                    },
                    {
                        title: "Sheet 3",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°3",
                        owner: "Test"
                    },
                    {
                        title: "Sheet 4",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°4",
                        owner: "Test2"
                    },
                    {
                        title: "Sheet 5",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°5",
                        owner: "Test2"
                    },
                    {
                        title: "Sheet 6",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°6",
                        owner: "Test2"
                    },
                    {
                        title: "Sheet 7",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°7",
                        owner: "Test2"
                    },
                    {
                        title: "Sheet 8",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°8",
                        owner: "Test2"
                    },
                    {
                        title: "Sheet 9",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°9",
                        owner: "Test2"
                    }
                ])
            },
            1000)        // We return the object after 1 second.
        })
    }
}

export default Sheets