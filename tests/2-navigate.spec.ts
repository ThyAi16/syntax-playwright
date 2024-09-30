import {test, expect} from '@playwright/test';
import { TIMEOUT } from 'dns';
import { register } from 'module';

//Xử lý nhiều Dialog mở ra ngẫu nhiên
test('Interact with random dialog', async({page}) =>
    {
        await test.step("Vao material playwright", async() =>
        {
            await page.goto('https://material.playwrightvn.com/025-page-with-random-dialog.html');
        }
        )
    
        await test.step("Accept Dialog", async () => 
        {
            page.on('dialog', async dialog =>
            {
                await dialog.accept();
                //await page.waitForTimeout(6000);
            }
            );

             await expect(page.locator("//element[@id='greetingMessage']")).toBeVisible({timeout: 500000});

        }
        )
    
    }
    )

test('Basic action', async ({page}) =>
{
    await page.goto("https://material.playwrightvn.com/018-mouse.html");
    //Single click
    await page.locator("//div[@id='clickArea']").click();
    //Double click
    await page.locator("//div[@id='clickArea']").dblclick();
    //Right click
    await page.locator("//div[@id='clickArea']").click({
        button: 'right'
    });
    //Phim khac
    await page.locator("//div[@id='clickArea']").click({
        modifiers: ["Shift", "Control"]
    })

}
)

//Input
test('Basic input', async ({page})=>
{
    await page.goto("https://material.playwrightvn.com/01-xpath-register-page.html");

    //Go 1 lan
    //await page.locator("//input[@id='username']").fill("udemy@gmail.com");

    //Go tung ky tu
    await page.locator("//input[@id='username']").pressSequentially("udemy@gmail.com");
    delay: 1000;

    //Radio
    await page.locator("//input[@id='female']").check();

    //Checkbox

    await page.locator("//input[@id='reading']").check();

    //await page.locator("//input[@id='cooking']").check();

    // uncheck
    //await page.locator("//input[@id='cooking']").uncheck();
    //delay: 2000;

    //Get check status
    const isCheck = await page.locator("//input[@id='cooking']").isChecked();
    console.log(isCheck);
}
)

test('select', async ({page}) =>
    {
    await page.goto("https://material.playwrightvn.com/01-xpath-register-page.html");

    await page.locator("//select[@id='country']").selectOption("Australia");

    await page.locator("//select[@id='interests']").selectOption(["Music", "Art", "Sports"]);

    }
)

test('date', async ({page})=>
{
    await page.goto("https://material.playwrightvn.com/01-xpath-register-page.html");

    await page.locator("//input[@id='username']").fill("udemy");
    await page.locator("//input[@id='email']").fill("udemy@gmail.com");

    await page.locator("//input[@id='dob']").fill("2024-01-03");

    await page.locator("//button[@type='submit']").click();
}
)


const registerPageUrl = "https://material.playwrightvn.com/01-xpath-register-page.html";

test('date picker, slider, color picker', async ({page}) =>
{
    await page.goto(registerPageUrl);

    await page.locator("//input[@id='dob']").fill("2024-09-07");
    await page.locator("//input[@id='rating']").fill("2");
    await page.locator("//input[@id='favcolor']").fill("#e66465");
}
);

//Tai file len, tooltip
test ('file, tooltip', async({page}) =>
{

    await page.goto(registerPageUrl);

    await page.locator("//input[@id='profile']").setInputFiles("tests/a.txt");
    await page.locator("//div[@class='tooltip']").hover();
}
)
 //Download file, lưu file
 //1. Download bắt được sự kiện
test('Download simple', async({page})=> 
{
    await page.goto('https://material.playwrightvn.com/021-import-export.html');
    const downloadPromise = page.waitForEvent("download");
    await page.getByText("Export CSV").click();

    const download = await downloadPromise;
    await download.saveAs("tests/fileAndimage/abc.csv" + download.suggestedFilename());

}
)
//2. Download không bắt được sự kiện
test('Download random', async({page}) =>
{
    await page.goto('https://material.playwrightvn.com/021-import-export.html');
    await page.on("download", download =>
    {
        download.saveAs("tests/fileAndimage/file_random01.csv")
    }
    );
    await page.getByText("Random Export").click();

    await page.waitForTimeout(5000);
}
)

//Timeout
//await page.waitForTimeout(1000);//1s

//Confirmation dialog
test('confirm dialog', async ({page}) => 
    {
        await page.goto('https://material.playwrightvn.com');
        await page.click("//a[@href='03-xpath-todo-list.html']");
        await page.locator("//input[@id='new-task']").fill("practice");
        await page.click("//button[@id='add-task']");

        page.once('dialog', async dialog => dialog.accept());

        await page.waitForTimeout(1000);

        await page.click("//button[text()='Delete']");

    }
);

//Tương tác Dialog trên trình duyệt
const xpath = (index?: number) =>
{
    return {
        newTaskField: '//input[@id="new-task"]',
        buttonAddTask: '//button[@id="add-task"]',
        buttonDeleteTask: `//li/span[test()='Todo ${index}}']//following-sibling::div//button[contains(@onclick,'deleteTask')]`,
        greetingMessage: `//p[text()='Chào mừng bạn đã đến với Playwright VN']`
    }
}
test.describe("Handle Dialog", async() =>
{
    test('Interact with Dialog', async ({page}) =>
    {
        await test.step("Vao material Playwright", async() =>
        {
            await page.goto('https://material.playwrightvn.com/03-xpath-todo-list.html');
        }
        )

        await test.step("Them Todo moi ", async() =>
        {
            await page.locator(xpath().newTaskField).fill("Todo 1");
            await page.locator(xpath().buttonAddTask).click();
        }
        )

        await test.step("Accpect Dialog", async()=>
        {
          page.once('dialog', async dialog => 
          {
            await page.waitForTimeout(1000);
            await dialog.accept();
          }
          )
        }
        )
        await page.locator(xpath(1).buttonDeleteTask).click();
    }
    )
}
)


//Mở nhiều tab trên 1 trình duyệt
test('open mutiple tab', async ({page}) =>
{
    const xpathClickArea = '//div[@id="clickArea"]';
    await page.goto('https://material.playwrightvn.com/018-mouse.html');
    await page.locator(xpathClickArea).click();

    //Mo tab moi
    const page2 = await page.context().newPage();
    page2.goto('https://material.playwrightvn.com/018-mouse.html');
    await page2.locator(xpathClickArea).dblclick();

}
);

//Thao tác Tab mới mở ra ngẫu nhiên
test('Random new tab open', async({page}) =>
{
  
        await page.goto("https://material.playwrightvn.com/021-page-random-open-new-page.html");

        //Doi page moi mo ra

        const newpage = await page.waitForEvent("popup");
        await newpage.waitForTimeout(1000);

        await newpage.click("//button[@id='registerBtn']");
}
)


//Mở ra tab mới khi click vào button






//Contains()
//div[contains(text(), ‘Tôi là Alex’)]

//Text()
// Hàm text()dùng để tìm ra phần tử có giá trị tương ứng. Ví dụ
// Với DOM sau:
// <div @class=”playwright”>This is a text</div>
// Thì để chọn phần tử này, ta dùng cú pháp như sau:
// //div[text()=’This is a text’]

