import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, ProductCardComponent, CarouselModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero glass-panel">
        <div class="hero-content">
          <div class="hero-badge">New Arrival</div>
          <h1 class="hero-title">
            iPhone 16 <span class="text-gradient">Pro Max</span>
          </h1>
          <p class="hero-subtitle">
            Titanium design, A18 Pro chip, and the best camera system ever in an iPhone.
            Experience the future today.
          </p>
          <div class="hero-price">
            From <span class="price">$1199</span>
          </div>
          
          <div class="hero-actions">
            <button pButton label="Buy Now" icon="pi pi-shopping-bag" class="p-button-lg p-button-rounded"></button>
            <button pButton label="View Specs" icon="pi pi-info-circle" class="p-button-lg p-button-rounded p-button-outlined"></button>
          </div>
        </div>
        
        <div class="hero-visual">
          <!-- Placeholder for Hero Image - would normally be a real image -->
           <div class="phone-mockup">
              <div class="screen-content">
                  <i class="pi pi-apple" style="font-size: 5rem; color: #fff;"></i>
              </div>
           </div>
        </div>
      </section>
      
      <!-- Featured Products -->
      <section class="products-section container">
        <div class="section-header">
           <h2 class="section-title">Trending <span>Smartphones</span></h2>
           <a routerLink="/shop" class="view-all">View All <i class="pi pi-arrow-right"></i></a>
        </div>
        
        <div class="products-grid">
          @for (product of featuredProducts; track product.id) {
            <app-product-card
              [title]="product.name"
              [price]="product.price"
              [originalPrice]="product.originalPrice"
              [discount]="product.discount"
              [category]="product.brand"
              [image]="product.image"
            />
          }
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="features-section container">
        <div class="features-grid-cards">
          <div class="feature-card glass-panel">
            <div class="icon-wrapper"><i class="pi pi-shield"></i></div>
            <h3>Official Warranty</h3>
            <p>1 Year Official Brand Warranty on all devices.</p>
          </div>
          
          <div class="feature-card glass-panel">
            <div class="icon-wrapper"><i class="pi pi-truck"></i></div>
            <h3>Fast Delivery</h3>
            <p>Free express shipping on orders over $500.</p>
          </div>
          
          <div class="feature-card glass-panel">
            <div class="icon-wrapper"><i class="pi pi-wallet"></i></div>
            <h3>Best Price Guarantee</h3>
            <p>We match any authorized retailer's price.</p>
          </div>
          
          <div class="feature-card glass-panel">
            <div class="icon-wrapper"><i class="pi pi-headphones"></i></div>
            <h3>24/7 Support</h3>
            <p>Expert assistance whenever you need it.</p>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content glass-panel">
          <h2>Ready to upgrade?</h2>
          <p>Trade in your old device and get up to $500 credit towards your new phone.</p>
          <button pButton label="Check Trade-in Value" class="p-button-rounded p-button-secondary p-button-lg"></button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding-bottom: 4rem;
    }
    
    /* Hero */
    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 4rem;
      padding: 5rem 6rem;
      margin: 2rem 2rem 6rem;
      min-height: 600px;
      position: relative;
      overflow: hidden;
      
      @media (max-width: 968px) {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 3rem 2rem;
        margin: 1rem;
      }
    }
    
    .hero-content {
      z-index: 2;
    }
    
    .hero-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(59, 130, 246, 0.1);
      color: var(--text-highlight);
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(59, 130, 246, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .hero-title {
      font-size: 4.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      
      @media (max-width: 768px) { font-size: 3rem; }
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 2.5rem;
      max-width: 600px;
      line-height: 1.7;
      
      @media (max-width: 968px) { margin: 0 auto 2.5rem; }
    }
    
    .hero-price {
      font-size: 1.5rem;
      color: var(--text-main);
      margin-bottom: 3rem;
      
      .price {
        font-size: 2.25rem;
        font-weight: 700;
        color: var(--secondary-color);
        text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
      }
    }
    
    .hero-actions {
      display: flex;
      gap: 1.5rem;
      
      @media (max-width: 968px) { justify-content: center; }
    }
    
    .hero-visual {
       display: flex;
       justify-content: center;
       align-items: center;
       
       .phone-mockup {
           width: 320px;
           height: 640px;
           background: #000;
           border-radius: 48px;
           border: 6px solid #374151;
           position: relative;
           box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
           display: flex;
           justify-content: center;
           align-items: center;
           background: linear-gradient(135deg, #111827 0%, #030712 100%);
           
           &::before {
               content: '';
               position: absolute;
               top: 0;
               left: 50%;
               transform: translateX(-50%);
               width: 120px;
               height: 25px;
               background: #000;
               border-radius: 0 0 16px 16px;
           }
       }
    }
    
    /* Products Section */
    .products-section {
      margin-bottom: var(--section-spacing);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 3rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
      
      .view-all {
        color: var(--primary-color);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: gap 0.2s;
        
        &:hover { gap: 0.75rem; }
      }
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2.5rem;
    }
    
    /* Features Section */
    .features-section {
      margin-bottom: var(--section-spacing);
    }
    
    .features-grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      padding: 3rem 2rem;
      text-align: center;
      transition: all 0.3s;
      
      &:hover { 
          transform: translateY(-5px); 
          background: rgba(31, 41, 55, 0.4);
      }
      
      .icon-wrapper {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1));
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        
        i { font-size: 1.75rem; color: var(--primary-color); }
      }
      
      h3 { margin-bottom: 1rem; font-size: 1.25rem; }
      p { color: var(--text-muted); font-size: 1rem; line-height: 1.6; }
    }
    
    /* CTA Section */
    .cta-section {
      padding: 0 2rem;
      margin-bottom: 4rem;
      
      .cta-content {
        max-width: 1000px;
        margin: 0 auto;
        padding: 5rem 2rem;
        text-align: center;
        background: linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
        
        h2 { font-size: 3rem; margin-bottom: 1.5rem; }
        p { font-size: 1.25rem; color: var(--text-muted); margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
      }
    }
  `]
})
export class HomeComponent {
  public readonly authService = inject(AuthService);

  featuredProducts = [
    { id: 1, name: 'iPhone 16 Pro', brand: 'Apple', price: 999, originalPrice: 1099, discount: 10, image: 'https://via.placeholder.com/300/111827/FFFFFF?text=iPhone+16' },
    { id: 2, name: 'Samsung S25 Ultra', brand: 'Samsung', price: 1299, image: 'https://via.placeholder.com/300/111827/FFFFFF?text=S25+Ultra' },
    { id: 3, name: 'Google Pixel 9 Pro', brand: 'Google', price: 899, originalPrice: 999, discount: 10, image: 'https://via.placeholder.com/300/111827/FFFFFF?text=Pixel+9' },
    { id: 4, name: 'Sony WH-1000XM6', brand: 'Sony', price: 349, originalPrice: 399, discount: 12, image: 'https://via.placeholder.com/300/111827/FFFFFF?text=Headphones' },{ id: 5, name: 'Apple AirPods Pro', brand: 'Apple', price: 249, originalPrice: 279, discount: 11, image: 'https://via.placeholder.com/300/111827/FFFFFF?text=AirPods+Pro' },{ id: 6, name: 'Microsoft Surface Headphones 2', brand: 'Microsoft', price: 199, originalPrice: 249, discount: 20, image: 'https://via.placeholder.com/300/111827/FFFFFF?text=Surface+Headphones' },
  ];
}

