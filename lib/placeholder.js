export     const placeholderSwitch = (e) => {
    switch(e){
        case 'html': return `<!-- Start writing HTML code here -->
e.g: <div>
<h1>Hello World</h1>
</div>



















        `;
        case 'css': return `/* Start writing CSS code here */
e.g: body {
background-color: #f1f1f1;
}



















        `;
        case 'javascript': return `/* Start writing JavaScript code here */
e.g: function add(a, b) {
return a + b;
}



















        `;
    }
};