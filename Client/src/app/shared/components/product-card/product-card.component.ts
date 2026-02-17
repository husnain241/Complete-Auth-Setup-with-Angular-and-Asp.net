import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule],
  template: `
    <div class="product-card glass-panel">
      <div class="product-image">
        <img [src]="image" [alt]="title">
        @if(discount) {
            <div class="discount-badge">-{{ discount }}%</div>
        }
      </div>
      
      <div class="product-info">
        <div class="info-header">
           <span class="product-category">{{ category }}</span>
           <div class="rating"><i class="pi pi-star-fill"></i> 4.9</div>
        </div>
        
        <h3 class="product-title">{{ title }}</h3>
        
        <div class="price-row">
          <div class="product-price">
            <span class="current-price">\${{ price }}</span>
            @if(originalPrice) {
              <span class="original-price">\${{ originalPrice }}</span>
            }
          </div>
          <button pButton icon="pi pi-shopping-bag" class="p-button-rounded p-button-text add-btn"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border: 1px solid rgba(255, 255, 255, 0.05);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.4);
        border-color: rgba(59, 130, 246, 0.3);
        
        .product-image img {
            transform: scale(1.08);
        }
        
        .add-btn {
            background: var(--primary-color);
            color: #fff;
        }
      }
    }
    
    .product-image {
      position: relative;
      padding-top: 85%; /* Slightly taller */
      background: #111827;
      overflow: hidden;
      
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .discount-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        background: var(--accent-color);
        color: #000;
        font-weight: 700;
        font-size: 0.75rem;
        padding: 4px 8px;
        border-radius: 4px;
      }
    }
    
    .product-info {
      padding: 1.5rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        
        .product-category {
          color: var(--primary-color);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .rating {
            font-size: 0.8rem;
            color: var(--text-muted);
            i { color: #fbbf24; font-size: 0.75rem; }
        }
    }
    
    .product-title {
      font-size: 1.15rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .price-row {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .product-price {
      display: flex;
      flex-direction: column;
      
      .current-price {
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--text-main);
      }
      
      .original-price {
        color: var(--text-muted);
        text-decoration: line-through;
        font-size: 0.85rem;
        margin-top: -2px;
      }
    }
    
    .add-btn {
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.05);
        color: var(--text-main);
        transition: all 0.2s;
    }
  `]
})
export class ProductCardComponent {
  @Input() title!: string;
  @Input() image: string = 'https://via.placeholder.com/300';
  @Input() price!: number;
  @Input() originalPrice?: number;
  @Input() discount?: number;
  @Input() category: string = 'Electronics';
}
