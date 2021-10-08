import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { ApiService } from 'app/shared/services/api.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrls: ['./autorizacion.component.scss']
})
export class AutorizacionComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  curp = '';
  paymentHandler:any = null;
  paymentIntent = [];
  clavePlan = '';
  costo = 0;
  descripcionPlan = '';
  plan = [];
  autorizacion = ''
  displayModalResponsive = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  stripeTest: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private api: ApiService,
    private ref: ChangeDetectorRef,
    private spinner: NgxSpinnerService
    ) {
      this.curp = localStorage.getItem('curp');
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.getPropuesta();
      });
    }

  ngOnInit(): void {
    this.invokeStripe();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  }


  getPropuesta() {
    this.api.getPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      this.plan = data;
      console.log(this.plan);
      this.costo = this.plan['costo'];
      this.clavePlan = this.plan['clavePlan'];
    });
  }

  createToken(): void {
    this.paymentIntent = [];
    const name = this.stripeTest.get('name').value;
    this.spinner.show();
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          result.token['paymentIntent'] = {
            "descripcion": this.plan['plan']['clavePlan'],
            "monto": this.plan['plan']['costo'],
            "moneda":"USD",
            "transaccion": "",
            "estatustransaccion": ""
          };

          result.token['propuestaid'] = this.plan['propuestaid'];
          result.token['curp'] = this.plan['curp'];

          // Use the token
          console.log(result.token);

          console.log(JSON.stringify(result.token));


          this.api.loginapp().pipe(first()).subscribe((data: any) => {
            this.api.postIntentarPagar(JSON.stringify(result.token), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
              console.log(data);
              this.spinner.hide();
              if (data.estatustransaccion == "succeeded") {
                this.displayModalResponsive=true;
              }
              this.ref.detectChanges();
            });
          });

        } else if (result.error) {
          // Error creating the token
          this.spinner.hide();
          console.log(result.error.message);
        }
      });
  }

  makePayment(amount) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51JZMBDLm93TetmkamLaX6DbO9PrSOY7zTlNJB2hLfXQLCwBWZMcH9LuCW0ZG6ZYURPVWWzGxyeD9JO9Q5zAruFmf00QuPJRxUr',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken)
        alert('Stripe token generated!');
      }
    });

    paymentHandler.open({
      name: 'Positronx',
      description: '3 widgets',
      amount: amount * 100
    });
  }

  invokeStripe() {
    if(!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51JZMBDLm93TetmkamLaX6DbO9PrSOY7zTlNJB2hLfXQLCwBWZMcH9LuCW0ZG6ZYURPVWWzGxyeD9JO9Q5zAruFmf00QuPJRxUr',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken)
            alert('Payment has been successfull!');
          }
        });
      }

      window.document.body.appendChild(script);
    }
  }

}
