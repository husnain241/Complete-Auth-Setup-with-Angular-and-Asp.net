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
            <p-tag [value]="'-' + discount + '%'" severity="danger" class="discount-tag"></p-tag>
        }
      </div>
      
      <div class="product-info">
        <h3 class="product-title">{{ title }}</h3>
        <p class="product-category">{{ category }}</p>
        
        <div class="product-price">
          <span class="current-price">\${{ price }}</span>
          @if(originalPrice) {
            <span class="original-price">\${{ originalPrice }}</span>
          }
        </div>
        
        <button pButton label="Add to Cart" icon="pi pi-shopping-bag" class="w-full mt-3"></button>
      </div>
    </div>
  `,
    styles: [`
    .product-card {
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.4);
        background: var(--card-hover-bg);
      }
    }
    
    .product-image {
      position: relative;
      padding-top: 75%; /* 4:3 Aspect Ratio */
      background: #1f2937;
      
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .discount-tag {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      
      &:hover img {
          transform: scale(1.05);
      }
    }
    
    .product-info {
      padding: 1.5rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .product-title {
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .product-category {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    
    .product-price {
      margin-top: auto;
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      
      .current-price {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-color);
      }
      
      .original-price {
        color: var(--text-muted);
        text-decoration: line-through;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ProductCardComponent {
    @Input() title!: string;
    @Input() image: string = 'https://via.placeholder.com/300'; // Default placeholder
    @Input() price!: number;
    @Input() originalPrice?: number;
    @Input() discount?: number;
    @Input() category: string = 'Electronics';
}
