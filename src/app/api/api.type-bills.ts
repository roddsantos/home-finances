import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { getSourceMapRange } from "typescript";

@Injectable({
    providedIn: "root",
})
export class TypeBillsService {
    userId: Number;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        let str = localStorage.getItem("user");
        if (str) this.userId = JSON.parse(str);
    }

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
        }),
    };

    getTypeBills() {
        return this.http.get(
            `http://ec2-54-94-128-41.sa-east-1.compute.amazonaws.com:4001/typebill`
        );
    }
}
