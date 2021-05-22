using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LightsOut_Game.Models
{
    public class Light
    {
        public int Id { get; set; }
        public bool Toggle { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
    }
}
