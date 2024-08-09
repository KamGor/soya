import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent  implements OnInit {
  ngOnInit() {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', 'http://localhost:3000/configs', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Data sent successfully:', xhr.responseText);
        } else if (xhr.readyState === 4) {
            console.error('Error sending data:', xhr.statusText);
        }
    };

    xhr.onprogress = () => {
      if(xhr.status === 200) {
        console.log(xhr.responseText);
      }
    }

    xhr.send(JSON.stringify({
      configs: ["TEST_2"],
    }));

    // setTimeout(() => {
    //   xhr.abort();
    // }, 5000);
  }
}
